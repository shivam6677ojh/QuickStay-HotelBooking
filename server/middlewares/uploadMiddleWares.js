import multer from "multer";
import { useOptimistic } from "react";

const upload = multer({storage : multer.diskStorage({})})

export default upload