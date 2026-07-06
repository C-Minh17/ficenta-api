import { PartialType } from "@nestjs/mapped-types";
import createTransactionDto from "./create-transaction.dto";

export default class updateTransactionDto extends PartialType(createTransactionDto) { }