import Foundation
import CoreBluetooth

@objc(Counter)
class Counter: RCTEventEmitter {

    @objc override func supportedEvents() -> [String]! {
        return ["device"]
    }

    private var count = 0

    var ble: BLEDiscovery?

    override init() {
        super.init()
        ble = BLEDiscovery(onDiscovered: { [weak self] peripheral in
            self?.sendEvent(withName: "device", body: peripheral.toBridgeObject())
        })
    }

    @objc
    func increment() {
        count += 1
        print("count is \(count)")
    }

    @objc
    override func constantsToExport() -> [AnyHashable : Any]! {
        ["initialCount": 0]
    }

    @objc
    override static func requiresMainQueueSetup() -> Bool {
        true
    }
}

extension CBPeripheral {

    func toBridgeObject() -> [String : AnyObject] {
        [
            "name": (name ?? "") as AnyObject,
            "address": identifier.uuidString as AnyObject
        ]
    }
}
