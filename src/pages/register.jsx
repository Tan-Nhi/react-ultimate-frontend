import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { registerUserAPI } from '../services/api.service';


const RegisterPage = () => {

    const [form] = Form.useForm();

    const navigate = useNavigate();

    const onFinish = async (values) => {
        console.log("check values", values);

        //call api
        const res = await registerUserAPI(
            values.fullName,
            values.email,
            values.password,
            values.phone);
        if (res.data) {
            notification.success({
                message: 'Registration User',
                description: 'Đăng ký user thành công',
            })
            navigate("/login");
        } else {
            notification.error({
                message: 'Registration User',
                description: JSON.stringify(res.message),
            })
        }
    }

    return (
        <>

            <Form
                layout='vertical'
                form={form}
                onFinish={onFinish}
                style={{ margin: "10px", }}
            // onFinishFailed={onFinishFailed}
            >

                <h2 style={{ textAlign: "center" }}>Đăng ký tài khoản</h2>
                <Row justify={"center"}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Full Name"
                            name="fullName"
                            rules={[{ required: true, message: 'Full Name không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify={"center"}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Email không được để trống!' }
                                ,
                                {
                                    type: 'email',
                                    message: 'Email không đúng định dạng!'
                                }]}

                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify={"center"}>
                    <Col xs={24} md={8}>
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
                            <Input.Password min={0} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify={"center"}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Phone Number"
                            name="phone"
                            rules={[{
                                required: true,
                                message: "Phone không được để trống!"
                            },
                            {
                                pattern: new RegExp(/\d+/g),
                                message: "Phone phải là số!"
                            }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify={"center"}>
                    <Col xs={24} md={8}>
                        <div>
                            <Button
                                onClick={() => form.submit()}
                                type='primary'>Register</Button>

                            {/* <Button onClick={() => {
                            form.setFieldsValue({
                                email: "hoidanit@gmail.com",
                                fullName: "crocodile"
                            })
                            console.log("Check form: ", form.getFieldValue())
                        }
                        }>Test</Button> */}
                        </div>
                        <Divider />
                        <p>Đã có tài khoản?  <Link to={"/login"} >Đăng nhập Tại Đây </Link>  </p>
                    </Col>
                </Row>
            </Form>

        </>
    );
}
export default RegisterPage;