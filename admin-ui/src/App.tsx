import React, { useEffect, useState } from "react";
import { Admin, DataProvider, Resource } from "react-admin";
import buildGraphQLProvider from "./data-provider/graphqlDataProvider";
import { theme } from "./theme/theme";
import Login from "./Login";
import "./App.scss";
import Dashboard from "./pages/Dashboard";
import { UserList } from "./user/UserList";
import { UserCreate } from "./user/UserCreate";
import { UserEdit } from "./user/UserEdit";
import { UserShow } from "./user/UserShow";
import {
  createBearerAuthorizationHeader,
  jwtAuthProvider,
} from "./auth-provider/ra-auth-jwt";
import {
  CREDENTIALS_LOCAL_STORAGE_ITEM,
  USER_DATA_LOCAL_STORAGE_ITEM,
} from "./constants";

const App = (): React.ReactElement => {
  const [dataProvider, setDataProvider] = useState<DataProvider | null>(null);
  useEffect(() => {
    buildGraphQLProvider
      .then((provider: any) => {
        setDataProvider(() => provider);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);
  if (!dataProvider) {
    return <div>Loading</div>;
  }
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const userData = params.get("user")
    ? JSON.parse(params.get("user") as string)
    : null;
  if (userData) {
    localStorage.setItem(
      CREDENTIALS_LOCAL_STORAGE_ITEM,
      createBearerAuthorizationHeader(userData.accessToken)
    );
    localStorage.setItem(
      USER_DATA_LOCAL_STORAGE_ITEM,
      JSON.stringify(userData)
    );
    window.history.replaceState(null, "", window.location.pathname);
  }
  return (
    <div className="App">
      <Admin
        title={"AzureAD Auth"}
        dataProvider={dataProvider}
        authProvider={jwtAuthProvider}
        theme={theme}
        dashboard={Dashboard}
        loginPage={Login}
      >
        <Resource
          name="User"
          list={UserList}
          edit={UserEdit}
          create={UserCreate}
          show={UserShow}
        />
      </Admin>
    </div>
  );
};

export default App;
