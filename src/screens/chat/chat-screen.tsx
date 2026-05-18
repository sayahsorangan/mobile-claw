import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';

import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput as RNTextInput,
  View,
} from 'react-native';

import {useHeaderHeight} from '@react-navigation/elements';
import {RouteProp, useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';

import {formatChatTime} from '@app/helpers/app';
import {useAppDispatch, useAppSelector} from '@app/hooks/redux';
import {Box, Text, useTheme} from '@app/themes';
import {IconButton} from '@components/button/icon-button';
import {Container} from '@components/container';
import {ModelPickerSheet} from '@components/model-picker-sheet';
import {
  createRoom,
  deleteMessagesByRoom,
  deleteRoom,
  getMessagesByRoomPaginated,
  getRoomById,
  saveMessage,
  updateRoomTitle,
} from '@lib/db/chat-repository';
import {LlamaManager} from '@lib/llm';
import {useChat, useLoadModel} from '@lib/llm/hooks';
import {useRag} from '@lib/rag/hooks';
import {llm_action, LlmMessage} from '@redux-store/slice/llm';
import {memory_action} from '@redux-store/slice/memory';
import {store} from '@redux-store/store';
import {RouteStackNavigation} from '@router/route-name';

const GENERATION_TIMEOUT_MS = 5 * 60 * 1000;
const PAGE_SIZE = 5;

const styles = StyleSheet.create({
  typingRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 2},
  typingDot: {width: 8, height: 8, borderRadius: 4, marginHorizontal: 3},
  sendButton: {width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center'},
  sendArrow: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 3,
  },
  textInput: {
    fontSize: 14,
    lineHeight: 20,
    maxHeight: 120,
    paddingTop: 0,
    paddingBottom: 0,
  },
});

// ---------------------------------------------------------------------------
// TypingIndicator — three bouncing dots shown while the model starts replying
// ---------------------------------------------------------------------------
const TypingIndicator: React.FC<{color: string}> = React.memo(({color}) => {
  const anims = useRef([new Animated.Value(0.3), new Animated.Value(0.3), new Animated.Value(0.3)]).current;

  useEffect(() => {
    const loops = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(anim, {toValue: 1, duration: 300, useNativeDriver: true}),
          Animated.timing(anim, {toValue: 0.3, duration: 300, useNativeDriver: true}),
          Animated.delay(500),
        ]),
      ),
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [anims]);

  return (
    <View style={styles.typingRow}>
      {anims.map((anim, i) => (
        <Animated.View key={i} style={[styles.typingDot, {backgroundColor: color, opacity: anim}]} />
      ))}
    </View>
  );
});

// ---------------------------------------------------------------------------
// StreamingText — fades in when the bubble first appears, then streams normally
// ---------------------------------------------------------------------------
type AssistantTextStyle = {color: string; fontSize: number; lineHeight: number};

const StreamingText: React.FC<{content: string; textStyle: AssistantTextStyle}> = React.memo(({content, textStyle}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {toValue: 1, duration: 250, useNativeDriver: true}).start();
  }, [opacity]);
  return <Animated.Text style={[textStyle, {opacity}]}>{content}</Animated.Text>;
});

// ---------------------------------------------------------------------------

const ChatMessageRow = React.memo(
  ({
    item,
    isStreaming,
    textColor,
    codeBg,
    typingColor,
  }: {
    item: LlmMessage;
    isStreaming: boolean;
    textColor: string;
    codeBg: string;
    typingColor: string;
  }) => {
    const assistantTextStyle = useMemo<AssistantTextStyle>(
      () => ({color: textColor, fontSize: 14, lineHeight: 20}),
      [textColor],
    );
    const markdownStyle = useMemo(
      () => ({
        body: assistantTextStyle,
        code_inline: {backgroundColor: codeBg, borderRadius: 4, paddingHorizontal: 4},
        fence: {backgroundColor: codeBg, borderRadius: 8, padding: 8},
      }),
      [assistantTextStyle, codeBg],
    );

    return (
      <Box
        alignSelf={item.role === 'user' ? 'flex-end' : 'flex-start'}
        maxWidth="85%"
        marginBottom="sm"
        borderRadius="md"
        paddingHorizontal="md"
        paddingVertical="xs"
        backgroundColor={item.role === 'user' ? 'primary' : 'grey_light'}
      >
        {item.role === 'user' ? (
          <Text variant="body_regular" color="white">
            {item.content}
          </Text>
        ) : isStreaming && !item.content ? (
          <TypingIndicator color={typingColor} />
        ) : isStreaming ? (
          <StreamingText content={item.content} textStyle={assistantTextStyle} />
        ) : (
          <Markdown style={markdownStyle}>{item.content || '…'}</Markdown>
        )}
        <Text
          mb={item.role === 'user' ? undefined : 'sm'}
          mt={'xs'}
          color={item.role === 'user' ? 'white' : 'grey_dark'}
          variant={'body_helper_regular'}
          textAlign={item.role === 'user' ? 'left' : 'right'}
        >
          {item.createdAt ? formatChatTime(new Date(item.createdAt)) : ''}
        </Text>
      </Box>
    );
  },
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.item.role === next.item.role &&
    prev.item.content === next.item.content &&
    prev.item.createdAt === next.item.createdAt &&
    prev.isStreaming === next.isStreaming &&
    prev.textColor === next.textColor &&
    prev.codeBg === next.codeBg &&
    prev.typingColor === next.typingColor,
);

// ---------------------------------------------------------------------------

type ChatRouteProp = RouteProp<RouteStackNavigation, 'chat'>;

const ChatScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const route = useRoute<ChatRouteProp>();
  const {messages, isGenerating, isModelLoaded, sendMessage, clearChat} = useChat();
  const {loadModel, progress} = useLoadModel();
  const {retrieveChunks} = useRag();
  const isEmbedReady = useAppSelector(state => state.RagReducer.isEmbedModelLoaded);
  const documentCount = useAppSelector(state => state.RagReducer.documentCount);
  const generatingRoomId = useAppSelector(state => state.LlmReducer.generatingRoomId);
  const [input, setInput] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [roomTitle, setRoomTitle] = useState('New Chat');
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const oldestCreatedAtRef = useRef<number | undefined>(undefined);
  const loadedCountRef = useRef(0);
  const isPrependingRef = useRef(false);
  const flatListRef = useRef<FlatList<LlmMessage>>(null);
  const prevMessageCountRef = useRef(0);
  const isModelLoading = progress > 0 && progress < 100;

  // SQLite room tracking
  const roomIdRef = useRef<string | null>(null);
  const isFirstExchangeRef = useRef(true);

  // Load existing room messages on mount if roomId param provided
  useEffect(() => {
    const roomId = route.params?.roomId;
    if (roomId) {
      roomIdRef.current = roomId;
      isFirstExchangeRef.current = false;
      const room = getRoomById(roomId);
      if (room) setRoomTitle(room.title);
      const history = getMessagesByRoomPaginated(roomId, PAGE_SIZE);
      const reduxMsgs: LlmMessage[] = history.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      }));
      dispatch(llm_action.setMessages(reduxMsgs));
      oldestCreatedAtRef.current = history[0]?.createdAt;
      loadedCountRef.current = history.length;
      setHasMoreHistory(history.length >= PAGE_SIZE);
    } else {
      dispatch(llm_action.clearMessages());
      roomIdRef.current = null;
      isFirstExchangeRef.current = true;
      loadedCountRef.current = 0;
      setHasMoreHistory(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload messages from SQLite when returning to screen.
  // Skip reload if we're actively generating for this room — Redux already has
  // the live streaming data and SQLite doesn't have the assistant reply yet.
  useFocusEffect(
    useCallback(() => {
      const roomId = roomIdRef.current;
      if (!roomId) return;
      if (generatingRoomId === roomId) return;
      const countToReload = Math.max(loadedCountRef.current, PAGE_SIZE);
      const history = getMessagesByRoomPaginated(roomId, countToReload);
      const reduxMsgs: LlmMessage[] = history.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      }));
      dispatch(llm_action.setMessages(reduxMsgs));
      oldestCreatedAtRef.current = history[0]?.createdAt;
      loadedCountRef.current = history.length;
      setHasMoreHistory(history.length >= countToReload);
    }, [dispatch, generatingRoomId]),
  );

  // Keep loadedCountRef in sync when new messages are added during a session
  // so useFocusEffect reloads the correct count when the screen regains focus.
  useEffect(() => {
    if (messages.length > loadedCountRef.current) {
      loadedCountRef.current = messages.length;
    }
  }, [messages.length]);

  const loadMoreHistory = useCallback(async () => {
    const roomId = roomIdRef.current;
    if (!roomId || isLoadingMore || !hasMoreHistory) return;
    setIsLoadingMore(true);
    const older = getMessagesByRoomPaginated(roomId, PAGE_SIZE, oldestCreatedAtRef.current);
    if (older.length > 0) {
      const reduxMsgs: LlmMessage[] = older.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      }));
      isPrependingRef.current = true;
      dispatch(llm_action.prependMessages(reduxMsgs));
      oldestCreatedAtRef.current = older[0]?.createdAt;
      loadedCountRef.current += older.length;
      setHasMoreHistory(older.length >= PAGE_SIZE);
    } else {
      setHasMoreHistory(false);
    }
    setIsLoadingMore(false);
  }, [dispatch, hasMoreHistory, isLoadingMore]);

  const handleScroll = useCallback(
    ({nativeEvent}: {nativeEvent: {contentOffset: {y: number}}}) => {
      if (nativeEvent.contentOffset.y < 80) {
        loadMoreHistory();
      }
    },
    [loadMoreHistory],
  );

  /** Fire-and-forget: ask the model for a short chat title and persist it */
  const generateRoomTitle = useCallback((roomId: string, firstUserMessage: string) => {
    const context = LlamaManager.getContext();
    if (!context) return;
    // Guard against concurrent context.completion() calls — llama.cpp is not thread-safe.
    // sendMessage sets this flag; if it's still busy (e.g. user sent a follow-up quickly),
    // skip LLM title generation and fall back to using the first few words instead.
    if (LlamaManager.isBusy()) {
      const fallbackTitle = firstUserMessage.trim().split(/\s+/).slice(0, 6).join(' ').slice(0, 60);
      if (fallbackTitle) {
        updateRoomTitle(roomId, fallbackTitle);
        setRoomTitle(fallbackTitle);
      }
      return;
    }
    LlamaManager.setBusy(true);
    context
      .completion({
        messages: [
          {
            role: 'system' as const,
            content:
              'You create very short chat titles. Reply with ONLY the title — max 6 words, no quotes, no trailing punctuation.',
          },
          {
            role: 'user' as const,
            content: `Create a short title for a conversation that starts with: "${firstUserMessage.slice(0, 200)}"`,
          },
        ],
        n_predict: 20,
        temperature: 0.5,
        enable_thinking: false,
        stop: [
          '</s>',
          '<|end|>',
          '<|eot_id|>',
          '<|end_of_text|>',
          '<|im_end|>',
          '<|EOT|>',
          '<|END_OF_TURN_TOKEN|>',
          '<|end_of_turn|>',
          '<|endoftext|>',
        ],
      })
      .then((result: any) => {
        const title = (result?.text ?? '')
          .trim()
          .replace(/^["']+|["'.!?,;:]+$/g, '')
          .slice(0, 60);
        if (title) {
          updateRoomTitle(roomId, title);
          setRoomTitle(title);
        }
      })
      .catch(() => {})
      .finally(() => {
        LlamaManager.setBusy(false);
      });
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isGenerating || !isModelLoaded) return;
    const text = input.trim();
    setInput('');

    // Ensure a room exists for this conversation
    const modelPath = store.getState().LlmReducer.modelPath;
    if (!roomIdRef.current) {
      const room = createRoom(modelPath ?? undefined);
      roomIdRef.current = room.id;
      isFirstExchangeRef.current = true;
    }
    const roomId = roomIdRef.current;
    const isFirst = isFirstExchangeRef.current;
    isFirstExchangeRef.current = false;

    let ragChunks: string[] | undefined;
    if (isEmbedReady && documentCount > 0) {
      try {
        // Retrieve top 3 chunks via embedding search + keyword rerank
        const retrieved = await retrieveChunks(text, {topK: 3, minScore: 0.3});
        if (retrieved.length > 0) {
          ragChunks = retrieved.map(r => r.chunk.text);
        }
      } catch {
        ragChunks = undefined;
      }
    }

    saveMessage(roomId, 'user', text);
    dispatch(llm_action.setGeneratingRoomId(roomId));
    await sendMessage(text, {roomId, ragChunks});

    // Save the final assistant reply to SQLite now that generation is complete.
    const allMsgs = store.getState().LlmReducer.messages;
    const lastMsg = allMsgs[allMsgs.length - 1];
    if (lastMsg?.role === 'assistant' && lastMsg.content) {
      saveMessage(roomId, 'assistant', lastMsg.content);
    }
    dispatch(llm_action.setGeneratingRoomId(null));

    if (isFirst) {
      generateRoomTitle(roomId, text);
    }
  }, [
    dispatch,
    input,
    isGenerating,
    isModelLoaded,
    sendMessage,
    isEmbedReady,
    documentCount,
    retrieveChunks,
    generateRoomTitle,
  ]);

  const handleClearChat = useCallback(() => {
    if (isGenerating) {
      Alert.alert('Cannot Delete', 'Please wait for the current response to finish generating.');
      return;
    }
    const roomId = roomIdRef.current;
    Alert.alert('Delete Chat', 'Are you sure you want to delete this chat? This cannot be undone.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (roomId) {
            deleteMessagesByRoom(roomId);
            deleteRoom(roomId);
            dispatch(memory_action.deleteRoomMemory(roomId));
          }
          // Clear the KV cache so the next conversation starts clean.
          // Without this, the model may continue using cached context from
          // the deleted conversation, causing contaminated responses.
          LlamaManager.getContext()?.clearCache(false);
          clearChat();
          roomIdRef.current = null;
          isFirstExchangeRef.current = true;
          navigation.goBack();
        },
      },
    ]);
  }, [clearChat, dispatch, navigation, isGenerating]);

  useEffect(() => {
    if (!isGenerating) return;

    const timeoutId = setTimeout(() => {
      if (!store.getState().LlmReducer.isGenerating) return;
      dispatch(llm_action.setGenerating(false));
      dispatch(llm_action.setGeneratingRoomId(null));
      Alert.alert('Response Stopped', 'Generation took more than 5 minutes and was stopped automatically.');
    }, GENERATION_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
  }, [dispatch, isGenerating]);

  const contentContainerStyle = useMemo(
    () => ({padding: theme.spacing.md, paddingBottom: theme.spacing.xl}),
    [theme.spacing.md, theme.spacing.xl],
  );

  const borderTopStyle = useMemo(() => ({borderTopColor: theme.colors.grey_light}), [theme.colors.grey_light]);

  const inputStyle = useMemo(() => [styles.textInput, {color: theme.colors.black}], [theme.colors.black]);

  const isSendDisabled = !isGenerating && (!input.trim() || !isModelLoaded);
  const sendButtonStyle = useMemo(
    () => [styles.sendButton, {backgroundColor: isSendDisabled ? theme.colors.grey : theme.colors.primary}],
    [isSendDisabled, theme.colors.grey, theme.colors.primary],
  );

  const lastMessageId = messages[messages.length - 1]?.id;

  const renderMessageItem = useCallback(
    ({item}: {item: LlmMessage}) => (
      <ChatMessageRow
        item={item}
        isStreaming={Boolean(isGenerating && item.id === lastMessageId)}
        textColor={theme.colors.black}
        codeBg={theme.colors.grey_light}
        typingColor={theme.colors.grey}
      />
    ),
    [isGenerating, lastMessageId, theme.colors.black, theme.colors.grey_light, theme.colors.grey],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: roomTitle,
      headerRight: () => (
        <Box flexDirection="row">
          <IconButton icon_name="trash-2" icon_color={theme.colors.danger} onPress={handleClearChat} />
        </Box>
      ),
    });
  }, [navigation, handleClearChat, theme.colors.danger, roomTitle]);

  useEffect(() => {
    const nextCount = messages.length;
    const prevCount = prevMessageCountRef.current;
    prevMessageCountRef.current = nextCount;

    if (nextCount === 0 || nextCount <= prevCount) {
      return;
    }

    // Don't auto-scroll when prepending older history — the user is reading upward.
    if (isPrependingRef.current) {
      isPrependingRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    }, 16);

    return () => clearTimeout(timer);
  }, [messages.length]);

  return (
    <Container translucent>
      {/* Model status bar */}
      {isModelLoading ? (
        <Box
          paddingHorizontal="md"
          paddingVertical="xs"
          backgroundColor="info_light"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flexDirection="row" alignItems="center" flex={1}>
            <ActivityIndicator size="small" color={theme.colors.info_dark} />
            <Text variant="body_helper_regular" color="info_dark" marginLeft="xs" flex={1}>
              Loading model... {progress}%
            </Text>
          </Box>
        </Box>
      ) : !isModelLoaded ? (
        <Box
          paddingHorizontal="md"
          paddingVertical="xs"
          backgroundColor="warning_light"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text variant="body_helper_regular" color="warning_dark" flex={1}>
            No model loaded — go to Profile to select one
          </Text>
          <Pressable
            onPress={() => {
              if (isGenerating) {
                Alert.alert('Cannot Change Model', 'Please wait for the current response to finish generating.');
              } else {
                setShowPicker(true);
              }
            }}
            disabled={isModelLoading}
          >
            <Text variant="body_helper_semibold" color="warning_dark">
              Select
            </Text>
          </Pressable>
        </Box>
      ) : null}

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
      >
        <Box flex={1}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            contentContainerStyle={contentContainerStyle}
            // removeClippedSubviews={false} prevents the Fabric
            // 'Attempt to recycle a mounted view' assertion that fires
            // when item heights change rapidly during token streaming.
            removeClippedSubviews={false}
            maintainVisibleContentPosition={{minIndexForVisible: 0}}
            onScroll={handleScroll}
            scrollEventThrottle={200}
            ListHeaderComponent={
              isLoadingMore ? (
                <Box alignItems="center" paddingVertical="sm">
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                </Box>
              ) : null
            }
            ListEmptyComponent={
              <Box flex={1} alignItems="center" justifyContent="center" paddingTop="xxl">
                <Text variant="h_4_medium" color="grey" textAlign="center">
                  {isModelLoaded ? 'Start a conversation' : 'Load a model in Profile to begin'}
                </Text>
              </Box>
            }
            renderItem={renderMessageItem}
          />
        </Box>

        {/* Input bar */}
        <Box
          flexDirection="row"
          alignItems="flex-end"
          padding="sm"
          borderTopWidth={1}
          style={borderTopStyle}
          backgroundColor="white"
        >
          <Box
            flex={1}
            borderRadius="md"
            backgroundColor="grey_light"
            paddingHorizontal="md"
            paddingVertical="xs"
            marginRight="xs"
            minHeight={40}
            justifyContent="center"
          >
            <RNTextInput
              value={input}
              onChangeText={setInput}
              placeholder={isModelLoaded ? 'Type a message…' : 'Load a model first'}
              placeholderTextColor={theme.colors.grey}
              multiline
              editable={isModelLoaded && !isGenerating}
              style={inputStyle}
            />
          </Box>

          <Pressable
            onPress={
              isGenerating
                ? () => {
                    dispatch(llm_action.setGenerating(false));
                    dispatch(llm_action.setGeneratingRoomId(null));
                  }
                : handleSend
            }
            disabled={isSendDisabled}
            style={sendButtonStyle}
          >
            {isGenerating ? (
              <Text style={{fontSize: 24, color: theme.colors.white, fontWeight: 'bold'}}>✕</Text>
            ) : (
              <View style={[styles.sendArrow, {borderLeftColor: theme.colors.white}]} />
            )}
          </Pressable>
        </Box>
      </KeyboardAvoidingView>

      <ModelPickerSheet
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelectModel={async path => {
          setShowPicker(false);
          await loadModel({modelPath: path, nGpuLayers: -1, contextSize: 2048});
        }}
      />
    </Container>
  );
};

export default ChatScreen;
