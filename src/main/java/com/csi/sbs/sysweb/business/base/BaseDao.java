package com.csi.sbs.sysweb.business.base;


public interface BaseDao<T> {
	
	
    int insert(T t);  
   
    int delete(String id);  
    
    int update(T t);

}
