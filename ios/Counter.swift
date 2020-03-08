import Foundation

@objc(Counter)
class Counter: RCTEventEmitter {

    @objc override func supportedEvents() -> [String]! {
        return ["device"]
    }

    private var count = 0

    @objc
    func increment() {
        count += 1
        print("count is \(count)")

        sendEvent(withName: "device", body: "test!")
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
