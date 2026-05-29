package com.myblog.model.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class CommentAdminDTO extends CommentDTO {
    private String articleTitle;
}
