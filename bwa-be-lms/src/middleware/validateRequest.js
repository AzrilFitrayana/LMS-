import { ZodError } from "zod";

// export const validateRequest = (schema) => {
//     function async(req, res, next) {
//         try {
//             schema.parse(req.body);
//             next();
//         } catch (error) {
//             const errorMessage = error.issues.map(err => err.message);
//             return res.status(500).json({ errors: 'invalid request', details: errorMessage});
//         }

//         return res.status(500).json({ errors: 'internal server error'});
//     }
// }


export const validateRequest = (schema) => async (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        // console.log(error.issues)

        const errorLog = error.issues.map((e) => {
            return e.path
        })

        console.log(errorLog)

        if(error instanceof ZodError) {
            const errorMessage = error.issues.map(err => err.message);
            return res.status(500).json({ errors: 'invalid request', details: errorMessage});
        }

        return res.status(500).json({ errors: 'internal server error'});
    }
}