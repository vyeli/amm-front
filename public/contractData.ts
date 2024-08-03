let contractData = {
  address: "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8",
  ABI: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_token1",
          type: "address",
        },
        {
          internalType: "address",
          name: "_token2",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_exchangeRate",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "target",
          type: "address",
        },
      ],
      name: "AddressEmptyCode",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "AddressInsufficientBalance",
      type: "error",
    },
    {
      inputs: [],
      name: "FailedInnerCall",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
      ],
      name: "SafeERC20FailedOperation",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "token1ToToken2",
          type: "bool",
        },
      ],
      name: "swap",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount1",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount2",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "token1ToToken2",
          type: "bool",
        },
      ],
      name: "Swapped",
      type: "event",
    },
    {
      inputs: [],
      name: "exchangeRate",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "token1",
      outputs: [
        {
          internalType: "contract IERC20",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "token2",
      outputs: [
        {
          internalType: "contract IERC20",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
};

export default contractData;
