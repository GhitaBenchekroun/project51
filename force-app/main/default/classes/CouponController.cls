public class CouponController {
    @AuraEnabled
    public static Coupon__c validateCoupon(String couponCode) {
        Coupon__c coupon = [SELECT Id, Name, couponN__c, User__c, StartDate__c, EndDate__c FROM Coupon__c WHERE Name = :couponCode LIMIT 1]?? new Coupon__c();

        if (!String.isBlank(coupon.Id) && coupon.User__c == UserInfo.getUserId() ) {
            return coupon;
        }

        return null;
    }
}