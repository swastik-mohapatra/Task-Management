import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { setAccessData , setLoading} from "../redux/reducers/systemConfigReducer";

export const getTaskData = async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(setAccessData({type:"loading",response: true}));
    const taskDetailsCollection = collection(db, "tasks");
    const data = await getDocs(taskDetailsCollection);
    const filteredData = data.docs.map((item) => ({
      ...item.data(),
      id: item?.id,
    }));
    dispatch(
      setAccessData({ type: "taskGetDetails", response: filteredData })
    );
    console.log(filteredData)
    dispatch(setAccessData({type:"loading",response: false}));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setAccessData({type:"loading",response: false}));
    console.log(error);
  }
};
