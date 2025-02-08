import { collection, getDocs, query, where } from "firebase/firestore";
import { db ,auth} from "../config/firebase";
import { setAccessData } from "../redux/reducers/systemConfigReducer";

export const getTaskData = async (dispatch: any) => {
  try {
    const taskDetailsCollection = collection(db, "tasks");
    const q = query(taskDetailsCollection, where("userId", "==", auth?.currentUser?.uid));
    const data = await getDocs(q);
    const filteredData = data.docs.map((item) => ({
      ...item.data(),
      id: item?.id,
    }));
    dispatch(
      setAccessData({
        type: "taskGetDetails",
        response: filteredData,
      })
    );
  } catch (error) {
    dispatch(setAccessData({ type: "loading", response: false }));
    console.log(error);
  }
};
