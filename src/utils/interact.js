// export const getCurrentWalletConnected = async () => {
//   if (window.ethereum) {
//     try {
//       const accounts = await window.ethereum.request({
//         method: "eth_accounts",
//       });
//       if (accounts.length > 0) {
//         return {
//           address: accounts[0],
//           status: "👆🏽 Write a message in the text-field above.",
//         };
//       } else {
//         return {
//           address: "",
//           status: "🦊 Connect to Metamask using the top right button.",
//         };
//       }
//     } catch (err) {
//       return {
//         address: "",
//         status: "😥 " + err.message,
//       };
//     }
//   }
// };
