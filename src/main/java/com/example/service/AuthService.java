package com.example.service;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 获取token类
 */
public class AuthService {

    /**
     * 获取权限token
     * @return 返回示例：
     * {
     * "access_token": "24.460da4889caad24cccdb1fea17221975.2592000.1491995545.282335-1234567",
     * "expires_in": 2592000
     * }
     */
    public static String getAuth() {
        // 官网获取的 API Key 更新为你注册的
        String clientId = "EIMi405iGewuvS8OijvhHsDS";
        // 官网获取的 Secret Key 更新为你注册的
        String clientSecret = "1D59YAkb6RivQnKa9OQfprFQs3yScx2y";
        return getAuth(clientId, clientSecret);
    }

    /**
     * 获取API访问token
     * 该token有一定的有效期，需要自行管理，当失效时需重新获取.
     * @param ak - 百度云官网获取的 API Key
     * @param sk - 百度云官网获取的 Securet Key
     * @return assess_token 示例：
     * "24.460da4889caad24cccdb1fea17221975.2592000.1491995545.282335-1234567"
     */
    public static String getAuth(String ak, String sk) {
        // 获取token地址
        String authHost = "https://aip.baidubce.com/oauth/2.0/token?";
        String getAccessTokenUrl = authHost
                // 1. grant_type为固定参数
                + "grant_type=client_credentials"
                // 2. 官网获取的 API Key
                + "&client_id=" + ak
                // 3. 官网获取的 Secret Key
                + "&client_secret=" + sk;
        try {
            URL realUrl = new URL(getAccessTokenUrl);
            // 打开和URL之间的连接
            HttpURLConnection connection = (HttpURLConnection) realUrl.openConnection();
            connection.setRequestMethod("GET");
            connection.connect();
            // 获取所有响应头字段
            Map<String, List<String>> map = connection.getHeaderFields();
            // 遍历所有的响应头字段
            for (String key : map.keySet()) {
                System.err.println(key + "--->" + map.get(key));
            }
            // 定义 BufferedReader输入流来读取URL的响应
            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String result = "";
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
            /**
             * 返回结果示例
             */
            System.err.println("result:" + result);
            JSONObject jsonObject = new JSONObject(result);
            String access_token = jsonObject.getString("access_token");
            return access_token;
        } catch (Exception e) {
            System.err.printf("获取token失败！");
            e.printStackTrace(System.err);
        }
        return null;
    }
    /**
     * @Description: 获取词义相似度
     * @author tangxiang
     * @date 2018/5/1 16:42
     */
    public static Float getSim(String word1, String word2) {
        String host = "https://aip.baidubce.com/rpc/2.0/nlp/v2/word_emb_sim?charset=UTF-8&access_token=";
        System.out.println(getAuth());
        String url=host+getAuth();
        try {
            List<NameValuePair> nvps=new ArrayList<>();

            nvps.add(new BasicNameValuePair("word_1", word1));
            nvps.add(new BasicNameValuePair("word_2", word2));
            DefaultHttpClient httpClient = new DefaultHttpClient();
            HttpPost httpPost = new HttpPost(url);

            // 设置请求的header
            httpPost.addHeader("Content-Type", "application/json");
            httpPost.setEntity(new UrlEncodedFormEntity(nvps, "utf-8"));
            HttpResponse response = httpClient.execute(httpPost);
            com.alibaba.fastjson.JSONObject json=com.alibaba.fastjson.JSONObject.parseObject(EntityUtils.toString(response.getEntity(), "utf-8"));
            return json.getFloat("score");
        } catch (Exception e) {
            e.printStackTrace(System.err);
        }
        return null;
    }

    public static void main(String[] args) {
//        System.out.println(getAuth());
        System.out.println(getSim("上海","北京"));
    }
}

