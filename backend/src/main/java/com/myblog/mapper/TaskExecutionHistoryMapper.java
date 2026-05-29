package com.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.myblog.model.entity.TaskExecutionHistory;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TaskExecutionHistoryMapper extends BaseMapper<TaskExecutionHistory> {

    @Select("SELECT * FROM task_execution_history WHERE task_name = #{taskName} ORDER BY executed_at DESC LIMIT #{limit}")
    List<TaskExecutionHistory> selectRecentByTaskName(@Param("taskName") String taskName, @Param("limit") int limit);
}
