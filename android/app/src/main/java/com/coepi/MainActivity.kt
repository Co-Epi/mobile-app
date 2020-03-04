package com.coepi

import android.content.Intent
import android.os.Bundle
import com.coepi.ble.BLEManager
import com.facebook.react.ReactActivity

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String? = "CoEpi"

    private val bleManager = BLEManager(this)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        bleManager.onActivityCreated()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        bleManager.onActivityResult(requestCode, resultCode, data)
    }
}
