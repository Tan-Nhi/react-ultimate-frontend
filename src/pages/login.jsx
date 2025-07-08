import { Button, Col, Divider, Form, Input, message, notification, Row } from "antd";
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "../services/api.service";
import { useContext, useState } from "react";
import { AuthContext } from "../components/context/auth.context";

const LoginPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { setUser } = useContext(AuthContext);

    const onFinish = async (values) => {
        setLoading(true);
        const res = await loginAPI(values.email, values.password);
        if (res.data) {
            message.success("Đăng nhập thành công!");
            localStorage.setItem("access_token", res.data.access_token);
            setUser(res.data.user);
            navigate("/");
        } else {
            notification.error({
                message: "Error Login!",
                description: JSON.stringify(res.message)
            })
        }
        setLoading(false);
    }
    return (
        <>
            <Row justify={"center"} style={{ marginTop: "30px" }}>
                <Col xs={24} md={8} lg={8}>
                    <fieldset style={{
                        border: "1px solid #ccc",
                        padding: "15px",
                        margin: "5px",
                        borderRadius: "5px",
                    }}>
                        <legend>Đăng nhập</legend>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                        >

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Email không được để trống!'
                                    }
                                    ,
                                    {
                                        type: 'email',
                                        message: 'Email không đúng định dạng!'
                                    }]}

                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Password không được để trống!',
                                    },
                                    {
                                        min: 6,
                                        message: "Password phải trên 6 kí tự!"
                                    }
                                ]}
                            >
                                <Input.Password onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        form.submit();
                                    }
                                }} />
                            </Form.Item>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Button
                                    loading={loading}
                                    onClick={() => form.submit()}
                                    type='primary'>Login</Button>
                                <Link to="/">Go to home page <ArrowRightOutlined /> </Link>
                            </div>

                        </Form>
                        <Divider />
                        <div style={{ textAlign: "center" }}>Chưa có tài khoản?  <Link to={"/register"} >Đăng ký Tại Đây</Link>  </div>

                    </fieldset>
                </Col>
            </Row>
        </>
    );
}
export default LoginPage;