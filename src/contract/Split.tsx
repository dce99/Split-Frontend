const abi = [
    {
        "inputs": [],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "AccessDenied",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "AgreementAlreadyApproved",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "AgreementHasZeroCollateral",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "AgreementNotApprovedByBorrower",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "AlreadyPaid",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "BorrowerAlreadyPaid",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "BorrowerMustApproveAtleastValueEqualCollateralToApproveSplitAgreement",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "BorrowerMustApproveContractAtleastOwedAmount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CannotLevyPenaltyBeforeLockTime",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CollateralAlreadyWithdrawed",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "EmptySplitName",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "given",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "min",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "max",
                "type": "uint256"
            }
        ],
        "name": "InvalidBorrowersCount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidLockTime",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "OnlyOwnerCanPerformOperation",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "OnlySplitBorrowersCanPerformOperation",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "OnlySplitCreatorCanPerformOperation",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "OwedAmountNotPaid",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PenaltyAlreadyLevied",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "PenaltyLeviedByLender",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "SplitNameNotFound",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZeroSplitAmount",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "splitName",
                "type": "bytes32"
            }
        ],
        "name": "approveAgreement",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "splitName",
                "type": "bytes32"
            }
        ],
        "name": "approvePayment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "baseTokenAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "totalSplitAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "lockTime",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "splitDescription",
                "type": "string"
            },
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "borrower",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "owedAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "collateral",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Split.Borrower[]",
                "name": "borrowers",
                "type": "tuple[]"
            }
        ],
        "name": "createSplit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            }
        ],
        "name": "getContractTokenBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "start",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "size",
                "type": "uint256"
            }
        ],
        "name": "getMySplits",
        "outputs": [
            {
                "internalType": "bytes32[]",
                "name": "",
                "type": "bytes32[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "splitName",
                "type": "bytes32"
            }
        ],
        "name": "getSplitBorrowerData",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "owedAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "collateral",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "agreementApproved",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "paidStatus",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "penalyLevied",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "collateralWithdrawed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "paymentApproved",
                        "type": "bool"
                    }
                ],
                "internalType": "struct Split.SplitBorrowerData",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "splitName",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            }
        ],
        "name": "getSplitBorrowerDataForCreator",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "owedAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "collateral",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "agreementApproved",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "paidStatus",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "penalyLevied",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "collateralWithdrawed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "paymentApproved",
                        "type": "bool"
                    }
                ],
                "internalType": "struct Split.SplitBorrowerData",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "splitName",
                "type": "bytes32"
            }
        ],
        "name": "getSplitData",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "splitName",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "baseTokenAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalSplitAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "lockTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "splitDescription",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "remainingPayments",
                        "type": "uint256"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "borrower",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "owedAmount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "collateral",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct Split.Borrower[]",
                        "name": "borrowers",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct Split.SplitGeneralData",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            }
        ],
        "name": "getTokenBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "splitName",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            }
        ],
        "name": "levyPenalty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "splitName",
                "type": "bytes32"
            }
        ],
        "name": "withdrawCollateral",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

export default abi;