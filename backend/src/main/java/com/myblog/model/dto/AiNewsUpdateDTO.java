package com.myblog.model.dto;

import lombok.Data;

@Data
public class AiNewsUpdateDTO {
    private String title;
    private String summary;
    private String coverImage;
    private String content;
}
