  // LocalNetworkPrivacy.h

@interface LocalNetworkPrivacy : NSObject

- (void)checkAccessState:(void (^)(BOOL))completion;

@end

  // LocalNetworkPrivacy.m

#import <UIKit/UIKit.h>
#import "LocalNetworkPrivacy.h"

@interface LocalNetworkPrivacy () <NSNetServiceDelegate>

@property (nonatomic) NSNetService *service;
@property (nonatomic) void (^completion)(BOOL);
@property (nonatomic) NSTimer *timer;
@property (nonatomic) BOOL publishing;

@end

@implementation LocalNetworkPrivacy

- (instancetype)init {
  if (self = [super init]) {
    self.service = [[NSNetService alloc] initWithDomain:@"local." type:@"_lnp._tcp." name:@"LocalNetworkPrivacy" port:1100];
  }
  return self;
}

- (void)dealloc {
  [self.service stop];
}

- (void)checkAccessState:(void (^)(BOOL))completion {
  self.completion = completion;
  
  self.timer = [NSTimer scheduledTimerWithTimeInterval:2 repeats:YES block:^(NSTimer * _Nonnull timer) {
    if (UIApplication.sharedApplication.applicationState != UIApplicationStateActive) {
      return;
    }
    
    if (self.publishing) {
      [self.timer invalidate];
      self.completion(NO);
    }
    else {
      self.publishing = YES;
      self.service.delegate = self;
      [self.service publish];
    }
  }];
}


#pragma mark - NSNetServiceDelegate

- (void)netServiceDidPublish:(NSNetService *)sender {
  [self.timer invalidate];
  self.completion(YES);
}

@end
