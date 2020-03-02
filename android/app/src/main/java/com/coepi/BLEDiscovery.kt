package org.coepi.btscanner

import android.bluetooth.BluetoothAdapter
import android.bluetooth.le.BluetoothLeScanner
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.Context

class BLEDiscovery(context: Context) {

    private val adapter: BluetoothAdapter? = context.bluetoothManager?.adapter.also {
        if (it == null) {
            log.d("Adapter is null")
        }
    }
    private val scanner: BluetoothLeScanner? = adapter?.bluetoothLeScanner

    fun discover() {
        log.d("Starting BLE discovery")
        scanner?.startScan(listOf(), ScanSettings.Builder().build(), callback)
    }

    fun stopDiscovery() {
        log.v("Stopping BLE discovery")
        scanner?.stopScan(callback)
    }

    private val callback = object : ScanCallback() {
        override fun onScanResult(callbackType: Int, result: ScanResult?) {
            result?.device?.let {
                log.d("Discovered device: ${it.debugDescription}")
            } ?: {
                log.v("Got scan result without a device")
            }()
        }

        override fun onScanFailed(errorCode: Int) {
            super.onScanFailed(errorCode)
            log.d("Scan failed. Error code: $errorCode")
        }
    }
}
