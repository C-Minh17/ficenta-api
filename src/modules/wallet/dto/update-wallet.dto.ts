import { OmitType, PartialType } from "@nestjs/mapped-types";
import createWalletDto from "./create-wallet.dto";

export default class updateWalletDto extends PartialType(
  OmitType(createWalletDto, ['current_balance'] as const)
) { }
