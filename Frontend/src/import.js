import Login from "./components/Login";
import Input from "./components/Input";
import Button from "./components/Button";
import Register from "./components/Register";
import OtpValidator from "./components/OtpValidator";
import Header from "./components/Header";
import Contacts from "./components/Contacts";
import AddContact from "./components/AddContact";
import EditContact from "./components/EditContact";
import {login,logout,getContacts} from './redux/reducerSlice.js'
import SpamReport from "./components/SpamReport.jsx";
import SpamForm from "./components/SpamForm.jsx";
import config from "../config/config.js";
import Delete from "./components/Delete.jsx";
import Logout from "./components/Logout.jsx";
import { uploadToCloudinary ,fetchData,postData} from "./utils/utils.js";
export {Login,Input,Button,Register,OtpValidator,Header,Contacts,AddContact,EditContact,login,Logout,logout,getContacts,SpamReport,SpamForm,config,Delete,uploadToCloudinary,fetchData,postData}