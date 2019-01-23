package com.csi.sbs.sysweb.business.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.fasterxml.jackson.core.JsonProcessingException;

import io.swagger.annotations.Api;
import springfox.documentation.annotations.ApiIgnore;

@CrossOrigin//解决跨域请求
@Controller
@RequestMapping("/sysweb")
@Api(value = "Then controller is sysconfig")
public class SyswebController {
       
       @RequestMapping(value = "/index", method = RequestMethod.GET)
       @ApiIgnore()
   	   public String index() throws JsonProcessingException{
    	  return "index";
   	   }

       @RequestMapping(value = "/index/testApi", method = RequestMethod.GET)
       @ApiIgnore()
   	   public String testApi() throws JsonProcessingException{
    	  return "testApi";
   	   }
}
