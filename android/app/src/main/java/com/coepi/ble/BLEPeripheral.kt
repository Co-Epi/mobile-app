package com.coepi.ble

import android.bluetooth.BluetoothManager
import android.content.Context
import android.content.Context.BLUETOOTH_SERVICE
import com.coepi.log

class BLEPeripheral(
    context: Context
) {
    init {
        val manager = (context.getSystemService(BLUETOOTH_SERVICE) ?: {
            throw Throwable("Bluetooth service is null")
        }()) as BluetoothManager

        val adapter = manager.adapter ?: {
            throw Throwable("No bluetooth adapter. Can't continue.")
        }()

        BLEAdvertiser(adapter).startAdvertising(Uuids.service)
        BLEServiceManager(manager, context)

        log.i("Started peripheral")
    }
}
