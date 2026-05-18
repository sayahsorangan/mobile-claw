package com.template_s2t

import android.os.Build
import android.os.Bundle
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.modules.core.DeviceEventManagerModule

class NotificationListener : NotificationListenerService() {

    private val blockedApps = listOf(
        "com.android.systemui",
        "com.google.android.gms",
        "com.google.android.googlequicksearchbox"
    )

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val packageName = sbn.packageName

        if (blockedApps.contains(packageName)) return

        val notification = sbn.notification
        val extras: Bundle = notification.extras

        // ── Extras ──────────────────────────────────────────────────────────
        val title      = extras.getString("android.title") ?: ""
        val titleBig   = extras.getString("android.title.big") ?: ""
        val text       = extras.getCharSequence("android.text")?.toString() ?: ""
        val bigText    = extras.getCharSequence("android.bigText")?.toString() ?: ""
        val subText    = extras.getCharSequence("android.subText")?.toString() ?: ""
        val summaryText = extras.getCharSequence("android.summaryText")?.toString() ?: ""
        val infoText   = extras.getCharSequence("android.infoText")?.toString() ?: ""
        val template   = extras.getString("android.template") ?: ""

        // Progress
        val progress       = extras.getInt("android.progress", 0)
        val progressMax    = extras.getInt("android.progressMax", 0)
        val progressIndet  = extras.getBoolean("android.progressIndeterminate", false)

        // ── Notification fields ─────────────────────────────────────────────
        val category   = notification.category ?: ""
        val group      = notification.group ?: ""
        val sortKey    = notification.sortKey ?: ""
        val color      = notification.color          // Int (ARGB)
        val number     = notification.number
        val visibility = notification.visibility     // -1 secret, 0 private, 1 public
        val channelId  = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            notification.channelId ?: ""
        } else ""

        // Badge / shortcut
        val badgeIconType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            notification.badgeIconType
        } else 0

        // Actions
        val actionsArray: WritableArray = Arguments.createArray()
        notification.actions?.forEach { action ->
            actionsArray.pushString(action.title?.toString() ?: "")
        }

        // ── StatusBarNotification fields ────────────────────────────────────
        val map = Arguments.createMap().apply {
            // Identity
            putString("packageName", packageName)
            putInt("notificationId", sbn.id)
            putString("tag", sbn.tag ?: "")
            putString("key", sbn.key ?: "")
            putString("groupKey", sbn.groupKey ?: "")
            putBoolean("isOngoing", sbn.isOngoing)
            putBoolean("isClearable", sbn.isClearable)
            putDouble("postTime", sbn.postTime.toDouble())
            putDouble("when", notification.`when`.toDouble())

            // Text content
            putString("title", title)
            putString("titleBig", titleBig)
            putString("text", text)
            putString("bigText", bigText)
            putString("subText", subText)
            putString("summaryText", summaryText)
            putString("infoText", infoText)
            putString("template", template)

            // Progress
            putInt("progress", progress)
            putInt("progressMax", progressMax)
            putBoolean("progressIndeterminate", progressIndet)

            // Notification metadata
            putString("category", category)
            putString("group", group)
            putString("sortKey", sortKey)
            putInt("color", color)
            putInt("number", number)
            putInt("visibility", visibility)
            putString("channelId", channelId)
            putInt("badgeIconType", badgeIconType)
            putArray("actions", actionsArray)
        }

        val reactContext =
            (application as ReactApplication)
                .reactHost
                ?.currentReactContext

        reactContext
            ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit("NotificationReceived", map)
    }
}
