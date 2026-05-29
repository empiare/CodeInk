package com.myblog.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("page_visits")
public class PageVisit {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String ipAddress;
    private String pagePath;
    private LocalDateTime visitedAt;
}
