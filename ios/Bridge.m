#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Bridge, NSObject)
    RCT_EXTERN_METHOD(startDiscovery)
    RCT_EXTERN_METHOD(startAdvertising)
@end
