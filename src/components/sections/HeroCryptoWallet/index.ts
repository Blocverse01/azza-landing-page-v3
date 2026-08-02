/**
 * `/products/crypto-wallet` hero - 412:1587.
 *
 * `BuyCryptoWidget` is deliberately NOT re-exported here. It is a client
 * component and this barrel is imported by a server route; keeping the client
 * boundary at its own module means the route never pulls the widget's state
 * into its own graph by accident.
 */
export { HeroCryptoWallet } from "./HeroCryptoWallet";
export { default } from "./HeroCryptoWallet";
