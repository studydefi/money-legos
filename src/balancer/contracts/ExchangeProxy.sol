pragma solidity ^0.5.0;


interface ExchangeProxy {

    function batchSwapExactIn(
        Swap[] memory swaps,
        address tokenIn,
        address tokenOut,
        uint totalAmountIn,
        uint minTotalAmountOut
    ) public returns (uint totalAmountOut);
    
    function batchSwapExactOut(
        Swap[] memory swaps,
        address tokenIn,
        address tokenOut,
        uint maxTotalAmountIn
    ) public returns (uint totalAmountIn);
    
    function batchEthInSwapExactIn(
        Swap[] memory swaps,
        address tokenOut,
        uint minTotalAmountOut
    ) public payable returns (uint totalAmountOut);
    
    function batchEthOutSwapExactIn(
        Swap[] memory swaps,
        address tokenIn,
        uint totalAmountIn,
        uint minTotalAmountOut
    ) public returns (uint totalAmountOut);
    
    function batchEthInSwapExactOut(
        Swap[] memory swaps,
        address tokenOut
    ) public payable returns (uint totalAmountIn);
    
    function batchEthOutSwapExactOut(
        Swap[] memory swaps,
        address tokenIn,
        uint maxTotalAmountIn
    ) public returns (uint totalAmountIn);
    
}