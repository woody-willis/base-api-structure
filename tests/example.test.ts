import request from "supertest";
import app from "../src/app";

describe("GET /v1/example", () => {
    it("should return 200 and the correct response with query param", async () => {
        const param = "testParam";
        const response = await request(app)
            .get("/v1/example")
            .query({ exampleparam: param });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            exampleBodyResponse: `You sent the parameter: ${param}`,
        });
    });

    it("should return 200 and correct response without query param", async () => {
        const response = await request(app).get("/v1/example");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            exampleBodyResponse: "You sent the parameter: undefined",
        });
    });
});
