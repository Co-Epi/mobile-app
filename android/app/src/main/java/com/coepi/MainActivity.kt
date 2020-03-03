package com.coepi

import android.Manifest.permission.ACCESS_COARSE_LOCATION
import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.livinglifetechway.quickpermissions_kotlin.runWithPermissions

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String? = "CoEpi"

    val btEnabler = BLEEnabler(this) { enabled ->
        if (enabled) {
            BLEDiscovery(this).discover()
        } else {
            log.e("Couldn't enable bluetooth")
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        runWithPermissions(ACCESS_COARSE_LOCATION) {
            btEnabler.enable()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        btEnabler.onActivityResult(requestCode, resultCode, data)
    }
}
