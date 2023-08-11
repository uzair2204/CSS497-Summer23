package com.mehvi.lady.webapplication.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Service
public class ObjectMapperService {

    private final ObjectMapper mapper;
    
    public ObjectMapperService(){
        mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
    }

    public <T> T fromJson(String jsonString, Class<T> valueType) throws  JsonProcessingException {
        return mapper.readValue(jsonString, valueType);
    }
}
