import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { feedback_services } from "./feedBack.service";
import { TFeedbackQuery } from "./feedBack.interface";

const create_feedback = catchAsync(async (req, res) => {
    const result = await feedback_services.create_feedback_into_db(req.body);
    manageResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Feedback submitted and analysed successfully!",
        data: result,
    });
});

const get_all_feedbacks = catchAsync(async (req, res) => {
    const query: TFeedbackQuery = {
        search: req.query.search as string | undefined,
        category: req.query.category as string | undefined,
        priority: req.query.priority as string | undefined,
        sentiment: req.query.sentiment as string | undefined,
        team: req.query.team as string | undefined,
    };

    const { feedbacks, total } = await feedback_services.get_all_feedbacks_from_db(query);

    manageResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Feedbacks fetched successfully!",
        data: feedbacks,
        meta: { total },
    });
});

const get_feedback_by_id = catchAsync(async (req, res) => {
    const result = await feedback_services.get_feedback_by_id_from_db(req.params.id);
    manageResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Feedback fetched successfully!",
        data: result,
    });
});

const delete_feedback = catchAsync(async (req, res) => {
    const result = await feedback_services.delete_feedback_from_db(req.params.id);
    manageResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Feedback deleted successfully!",
        data: result,
    });
});

export const feedback_controllers = {
    create_feedback,
    get_all_feedbacks,
    get_feedback_by_id,
    delete_feedback,
};
