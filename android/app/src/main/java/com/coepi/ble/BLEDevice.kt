package com.coepi.ble

import android.bluetooth.BluetoothDevice

data class BLEDevice(val name: String?, val address: String)

fun BluetoothDevice.toBLEDevice() =
    BLEDevice(name, address)
