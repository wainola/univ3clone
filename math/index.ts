import {log, sqrt, format, number, min} from 'mathjs'

const priceToTick = (p: number):number => {
  return Math.floor(log(p, 1.0001))
}

console.log(priceToTick(5000))

const q96 = 2 ** 96

const priceToSqrt = (p: number): string => {
  const sqrtResult = sqrt(p) as number
  return BigInt(sqrtResult * q96).toString()
}

console.log(priceToSqrt(5000))

const liquidity0 = (amount: number, pa: number, pb: number) => {
  let tempPa: number
  let tempPb: number
  if(pa > pb){
    tempPa = pb
    tempPb = pa
    
    return BigInt((amount * (tempPa * tempPb)/ q96) / (tempPb - tempPa))
  }

  return BigInt((amount * (pa * pb)/ q96) / (pb - pa))
}

const liquidity1 = (amount: number, pa: number, pb: number) => {
  let tempPa: number
  let tempPb: number
  if(pa > pb){
    tempPa = pb
    tempPb = pa
    
    return BigInt(amount * q96 / (tempPb - tempPa))
  }

  return BigInt(amount * q96 / (pa - pb))
}

const sqrtPriceLow = priceToSqrt(4545)
const sqrtPriceCur = priceToSqrt(5000)
const sqrtPriceUpper = priceToSqrt(5500)

const eth = 10**18
const amountEth = 1 * eth
const amountUSDC = 5000 * eth

const liq0 = liquidity0(amountEth, Number(sqrtPriceCur), Number(sqrtPriceUpper))
const liq1 = liquidity1(amountUSDC, Number(sqrtPriceCur), Number(sqrtPriceLow))

const liquidty = BigInt(min(Number(liq0), Number(liq1)))
console.log("liquidty:", liquidty.toString())

const calculateAmount0 = (liquidity: number, pa: number, pb: number) => {
  let tempPa: number
  let tempPb: number
  if(pa > pb){
    tempPa = pb
    tempPb = pa

    return BigInt(
      liquidity * q96 * (tempPb - tempPa)/ tempPa / tempPb
    )
  }
  return BigInt(
    liquidity * q96 * (pb - pa)/ pa / pb
  )
}

const calculateAmount1 = (liquidity: number, pa: number, pb: number) => {
  let tempPa: number
  let tempPb: number
  if(pa > pb){
    tempPa = pb
    tempPb = pa

    return BigInt(
      liquidity * (tempPb - tempPa) / q96
    )
  }

  return BigInt(
    liquidity * (pb - pa) / q96
  )
}

const amount0 = calculateAmount0(Number(liquidty), Number(sqrtPriceUpper), Number(sqrtPriceCur))

const amount1 = calculateAmount1(
  Number(liquidty), Number(sqrtPriceLow), Number(sqrtPriceCur)
)


export { priceToTick, priceToSqrt }