package com.myblog.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("users")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String username;
    private String email;
    private String password;
    private String googleId;
    private String displayName;
    private String avatarUrl;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
