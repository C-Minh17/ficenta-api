import { PartialType } from "@nestjs/mapped-types";
import createBudgetDto from "./create-budget.dto";

export default class updateBudgetDto extends PartialType(createBudgetDto) { }