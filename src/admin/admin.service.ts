import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { JwtTokenService } from '../user/jwt.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  // 根据邮箱或用户名查询所有用户
  async getUserList(email?: string, userName?: string): Promise<User[]> {
    const query: any = {};
    
    if (email) {
      query.email = { $regex: email, $options: 'i' }; // 不区分大小写的模糊匹配
    }
    
    if (userName) {
      query.userName = { $regex: userName, $options: 'i' }; // 不区分大小写的模糊匹配
    }
    
    // 如果既有email又有userName，使用OR查询
    if (email && userName) {
      query.$or = [
        { email: { $regex: email, $options: 'i' } },
        { userName: { $regex: userName, $options: 'i' } }
      ];
      delete query.email;
      delete query.userName;
    }
    
    return await this.userModel
      .find(query)
      .select('-password') // 排除密码字段
      .sort({ createdAt: -1 }) // 按创建时间倒序
      .exec();
  }

  // 管理员登录验证
  async adminLogin(userName: string, password: string): Promise<{ token: string; userInfo: any }> {
    const adminUserName = process.env.ADMIN_USER_NAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUserName || !adminPassword) {
      throw new UnauthorizedException('管理员配置未设置');
    }

    if (userName !== adminUserName || password !== adminPassword) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 生成JWT token
    const payload = {
      userId: 'admin',
      username: adminUserName,
      email: 'admin@system.com',
      role: 'admin'
    };

    const token = this.jwtTokenService.generateToken(payload);

    return {
      token,
      userInfo: {
        userId: 'admin',
        userName: adminUserName,
        role: 'admin'
      }
    };
  }


  /**
   * 获取 总用户数 
   * 获取 今日新增用户
   */
  async getUserCount() {
    try {
      // 获取总用户数
      const userTotal = await this.userModel.countDocuments();

      // 获取今日开始时间（00:00:00）
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 获取明日开始时间（用于范围查询）
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // 获取今日新增用户数
      const todayUserCount = await this.userModel.countDocuments({
        createdAt: {
          $gte: today,
          $lt: tomorrow
        }
      });

      // 获取昨日新增用户数（用于计算增长率）
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const yesterdayUserCount = await this.userModel.countDocuments({
        createdAt: {
          $gte: yesterday,
          $lt: today
        }
      });

      // 计算增长率（相对于昨日的增长百分比）
      let analysis = 0;
      if (yesterdayUserCount > 0) {
        analysis = Math.round(((todayUserCount - yesterdayUserCount) / yesterdayUserCount) * 100);
      } else if (todayUserCount > 0) {
        analysis = 100; // 昨日无新增，今日有新增，增长100%
      }

      return {
        userTotal,
        todayUserCount,
        analysis // 今日新增用户相对于昨日的增长百分比
      };
    } catch (error) {
      throw new Error(`获取用户统计数据失败: ${error.message}`);
    }
  }


}