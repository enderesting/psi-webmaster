import { EvalState } from "./eval_state";

export interface site{
    id: String,
    url: String,
    monitering_state: EvalState,
}