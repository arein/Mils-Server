{{{
    "title": "Processing Credit Card Payments on Mac OS X and Windows 8",
    "tags": ["payments", "credit card", "pci compliance"],
    "category": "implementation",
    "date": "3-16-2014"
}}}

We saw three options to implement Mils' payment system:
- Credit Card
- PayPal
- In-App Purchase (IAP)

At first we opted for IAP as we found it to be the user friendliest option. However, the app store guidelines of Apple and Microsoft prohibit using IAPs for non-digital goods.
Moreover, Apple and Microsoft charge a 30% fee for In-App Purchases which is quite expensive.
PayPal and Credit Card payments are quite expensive as well. The payment processors charge about 0,35€-0,40€ per letter. 

## PCI Compliance
In order to be able to process credit card payments you need to be PCI Compliant. PCI foresees special requirements on encryption for instance.
SDKs provided by common payment processors such as Paymill or Braintree guarantee PCI Compliance more or less out of the box.
Hence, we needed to use one of these SDKs.

## PCI Compliant Mac OS X / Windows 8 SDKs
Unfortunately, we did not find any payment processor who provides a Mac OS X or Windows 8 SDK. Only PayPal offers a Windows 8 SDK. However, PayPal's solution is based on a WebView which does not meet our usability requirements.

Therefore, we were looking for iOS and Windows Phone SDK which we could port to Mac OS X and Windows 8. Unfortunately, most SDKs, such as the SDKs provided by PayPal and Paymill are closed source and distributed as a library.
Only Braintree's SDK is fully open source. Hence, we ported Braintree's iOS SDK to Mac OS X and the Windows Phone SDK to Windows 8.
This was quite a tedious process as both the Mac OS X and Windows 8 encryption libraries differ a lot from their mobile pendants and are pretty bad documented.

## Solution
Our port is available on [GitHub](https://github.com/arein).
