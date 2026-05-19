import { config } from '../../../../lib/profiles/TR/Recommendation/REC-RSCND.js';
import REC from './REC.js';
import recommendationBase from './recommendationBase.js';

const { good: data } = REC;
const { buildCommonViewData, buildRecStability } = recommendationBase;

const profile = 'REC-RSCND';
const customData = {
    config: {
        ...data.config,
        ...config,
        profile,
        isRescinded: true,
        needImple: true,
    },
};

// Used in http://localhost:8001/doc-views/TR/Recommendation/REC-RSCND?type=good
const good = { ...data, ...customData };
const common = buildCommonViewData(good);

export default {
    good,
    ...common,
    stability: buildRecStability(good),
    'obsl-rescind': {
        noRationale: {
            ...good,
            sotd: {
                ...good.sotd,
                rescindText1: 'chosen to fake rescind',
            },
        },
        noExplanationLink: {
            ...good,
            sotd: {
                ...good.sotd,
                rescindLink:
                    'https://www.w3.org/2016/11/fake-obsoleting-rescinding/',
            },
        },
    },
};
