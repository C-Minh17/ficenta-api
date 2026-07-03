import { PartialType } from "@nestjs/mapped-types";
import createdTransferDto from "./create-transfer.dto";

export default class updatedTransferDto extends PartialType(createdTransferDto) { }