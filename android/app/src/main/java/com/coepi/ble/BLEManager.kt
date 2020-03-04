package com.coepi.ble

import android.Manifest.permission.ACCESS_COARSE_LOCATION
import android.app.Activity
import android.content.Intent
import com.coepi.log
import com.livinglifetechway.quickpermissions_kotlin.runWithPermissions

class BLEManager(private val activity: Activity) {
    private val btEnabler = BLEEnabler(activity) { enabled ->
        if (enabled) {
            BLEDiscovery(activity).discover()
        } else {
            log.e("Couldn't enable bluetooth")
        }
    }

    fun onActivityCreated() {
        activity.runWithPermissions(ACCESS_COARSE_LOCATION) {
            btEnabler.enable()
        }
    }

    fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        btEnabler.onActivityResult(requestCode, resultCode, data)
    }
}
