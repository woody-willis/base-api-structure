import { Request, Response } from "express";
import { ExampleGetRequestParams } from "../interfaces/request/example_get";
import { ExampleGetResponse } from "../interfaces/response/example_get";

export const getExample = async (
    req: Request<undefined, undefined, undefined, ExampleGetRequestParams>,
    res: Response<ExampleGetResponse>
) => {
    const param = req.query.exampleparam;

    res.send({ exampleBodyResponse: `You sent the parameter: ${param}` });
};
