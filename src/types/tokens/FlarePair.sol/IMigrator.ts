/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";

export interface IMigratorInterface extends utils.Interface {
  functions: {
    "desiredLiquidity()": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "desiredLiquidity"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "desiredLiquidity",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "desiredLiquidity",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IMigrator extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IMigratorInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    desiredLiquidity(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  desiredLiquidity(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    desiredLiquidity(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    desiredLiquidity(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    desiredLiquidity(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
