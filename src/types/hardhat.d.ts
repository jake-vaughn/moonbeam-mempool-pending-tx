/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import * as Contracts from ".";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";
import { ethers } from "ethers";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ITarget3",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ITarget3__factory>;
    getContractFactory(
      name: "BulkSend",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BulkSend__factory>;
    getContractFactory(
      name: "Token",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Token__factory>;
    getContractFactory(
      name: "WETH9",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.WETH9__factory>;

    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ITarget3",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ITarget3>;
    getContractAt(
      name: "BulkSend",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BulkSend>;
    getContractAt(
      name: "Token",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Token>;
    getContractAt(
      name: "WETH9",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.WETH9>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
