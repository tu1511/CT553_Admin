import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
// import { getCurrentSystemConfig } from "../../redux/thunk/systemConfigThunk";
// import { useSelector } from "react-redux";

const Logo = ({ ...props }) => {
  //   const dispatch = useDispatch();

  //   useEffect(() => {
  //     dispatch(getCurrentSystemConfig());
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  //   const currentConfigs = useSelector(
  //     (state) => state.systemConfigs.currentConfigs
  //   );

  return (
    <div {...props}>
      <Link to={"/"} className="flex w-full items-center justify-between px-6">
        <img
          className="w-1/5 rounded-full"
          src="/src/assets/logo.png"
          alt="logo Silver Charm"
        />
        <h1 className="text-xl font-bold uppercase">Silver Charm</h1>
      </Link>
    </div>
  );
};

export default Logo;
