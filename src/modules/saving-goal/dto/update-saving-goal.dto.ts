import { PartialType } from "@nestjs/mapped-types";
import createSavingGoalDto from "./create-saving-goal.dto";

export default class updateSavingGoalDto extends PartialType(createSavingGoalDto) { }