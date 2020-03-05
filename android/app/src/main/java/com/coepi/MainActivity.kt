package com.coepi

import android.bluetooth.BluetoothDevice
import android.content.Intent
import android.os.Bundle
import com.coepi.ble.BLEDiscovery
import com.coepi.ble.BLEPreconditions
import com.facebook.react.ReactActivity
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String? = "CoEpi"

    private val blePreconditions = BLEPreconditions(this, onReady = {
        onBLEReady()
    })

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        blePreconditions.onActivityCreated()
    }

    private fun onBLEReady() {
        reactNativeHost.reactInstanceManager.addReactInstanceEventListener {
            val module = it.getJSModule(RCTDeviceEventEmitter::class.java)
            BLEDiscovery(this, onDeviceDiscovered = { device ->
                module.emit("device", device.toBridgeObject())
            }).discover()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        blePreconditions.onActivityResult(requestCode, resultCode, data)
    }
}

fun BluetoothDevice.toBridgeObject(): WritableMap = Arguments.createMap().apply {
    putString("name", name)
    putString("address", address)
}
