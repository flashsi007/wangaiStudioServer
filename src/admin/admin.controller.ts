import { Controller, Get, Post, Put, Body, Param, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get("users")
    async getUserList(
        @Query('email') email?: string,
        @Query('userName') userName?: string
    ) {
        try {
            const users = await this.adminService.getUserList(email, userName);
            return {
                success: true,
                data: users,
                total: users.length,
                message: '获取用户列表成功'
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: '获取用户列表失败',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post("login") 
    async login(@Body() dto: LoginDto) { 
        try {
            const { userName, password } = dto;

            
            console.log(`${process.env.ADMIN_USER_NAME} -- ${ process.env.ADMIN_PASSWORD }` );
            
            const result = await this.adminService.adminLogin(userName, password);
            
            return {
                success: true,
                data: {
                    token: result.token,
                    userInfo: result.userInfo
                },
                message: '登录成功'
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: error.message || '登录失败',
                    error: error.message
                },
                error.status || HttpStatus.UNAUTHORIZED
            );
        }
    }

    @Get("user-count")
    async getUserCount() {
        try {
            const data = await this.adminService.getUserCount();
            return {
                success: true,
                data,
                message: '获取用户统计数据成功'
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: '获取用户统计数据失败',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}