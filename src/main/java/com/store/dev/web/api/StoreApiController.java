package com.store.dev.web.api;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.store.dev.dto.AdmDTO;
import com.store.dev.dto.ResponseDTO;
import com.store.dev.dto.SearchDTO;
import com.store.dev.dto.SearchResDTO;
import com.store.dev.dto.StoreDTO;
import com.store.dev.service.StoreService;

import io.github.bonigarcia.wdm.WebDriverManager;
import jakarta.annotation.Resource;





@RestController
@RequestMapping("/api/store")
public class StoreApiController {

    @Resource
    private StoreService storeService;

    @GetMapping("")
    public ResponseDTO searchList(SearchDTO searchDTO) {
        ResponseDTO res = new ResponseDTO();
        SearchResDTO resDTO = new SearchResDTO();

        List<StoreDTO> list = null;
        List<AdmDTO> sdList = null;
        List<AdmDTO> sggList = null;
        int count;

        if (!searchDTO.getType1().equals("my")) {
            list = storeService.selectListStore(searchDTO);
            count = storeService.selectListStoreByCount(searchDTO);
            sdList = storeService.selectListSdCluster(searchDTO);
            sggList = storeService.selectListSggCluster(searchDTO);

        } else {
            list = storeService.selectListStoreByDistance(searchDTO);
            count = storeService.selectListStoreCountByDistance(searchDTO);
        }

        resDTO.setList(list);
        resDTO.setCount(count);

        res.setStatus("success");
        res.setErrCode(null);
        res.setResult(list);
        res.setSdResult(sdList);
        res.setSggResult(sggList);
        res.setResultCnt(count);
        return res;
    }

    @GetMapping("/info")
    public ResponseDTO getMethodName(@RequestParam int seq, @RequestParam String category, @RequestParam String name,
            @RequestParam String doro, @RequestParam String jibeon) throws InterruptedException {
                ResponseDTO res = new ResponseDTO();

                WebDriverManager.chromedriver().setup();
                WebDriver driver = new ChromeDriver();
                JavascriptExecutor js = (JavascriptExecutor) driver;
        
                // doro와 jibeon 각각에서 첫 두 단어를 추출
                String[] doroParts = doro.split(" ");
                String doroFirstTwoWords = doroParts.length > 1 ? doroParts[0] + " " + doroParts[1] : doro;
        
                WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        
                // 카카오맵에서 검색하기
                System.out.println("새로운시작 카카오맵에서 검색하기");
                driver.get("https://m.map.kakao.com/actions/searchView?q=" + name + " " + doroFirstTwoWords);
                WebElement firstResult = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".list_result li")));
                firstResult.click();
        
                // 페이지가 로드될 때까지 대기합니다.
                wait.until(ExpectedConditions.presenceOfElementLocated(By.className("cont_grade")));
        
                // 현재 URL을 가져와 출력합니다.
                String currentUrl = driver.getCurrentUrl();
                System.out.println("현재 URL: " + currentUrl);
        
                // 블로그 후기 가져오기
                List<WebElement> blogReviewElements = new ArrayList<>();
                try {
                    blogReviewElements = driver.findElements(By.cssSelector(".list_review li"));
                } catch (NoSuchElementException | TimeoutException e) {
                    System.out.println("블로그 후기 요소를 찾을 수 없음");
                }
                List<Map<String, String>> blogReviewList = new ArrayList<>();
        
                for (WebElement blogReviewElement : blogReviewElements) {
                    Map<String, String> reviewData = new HashMap<>();
                    try {
                        reviewData.put("title", blogReviewElement.findElement(By.cssSelector(".tit_review")).getText());
                        reviewData.put("content", blogReviewElement.findElement(By.cssSelector(".txt_review")).getText());
                        reviewData.put("author", blogReviewElement.findElement(By.cssSelector(".loss_word")).getText());
                        reviewData.put("date", blogReviewElement.findElement(By.cssSelector(".review_date")).getText());
                        reviewData.put("link", blogReviewElement.findElement(By.cssSelector("a.link_review")).getAttribute("href"));
        
                        List<WebElement> photoElements = blogReviewElement.findElements(By.cssSelector(".photo_slider .item_photo img"));
                        List<String> photos = new ArrayList<>();
                        for (WebElement photoElement : photoElements) {
                            photos.add(photoElement.getAttribute("src"));
                        }
                        reviewData.put("photos", String.join(",", photos));
                    } catch (NoSuchElementException e) {
                        System.out.println("블로그 후기의 세부 요소를 찾을 수 없음");
                    }
                    blogReviewList.add(reviewData);
                }
        
                // 카카오사진
                System.out.println("카카오사진======");
                List<WebElement> listPhotoElements = new ArrayList<>();
                try {
                    wait.until(ExpectedConditions.presenceOfElementLocated(By.className("link_photo"))); // 요소가 로드될 때까지 대기
                    listPhotoElements = driver.findElements(By.className("link_photo"));
                } catch (NoSuchElementException | TimeoutException e) {
                    System.out.println("카카오 사진 요소를 찾을 수 없음");
                }
                List<String> photoHrefList = new ArrayList<>();
                for (WebElement listPhotoElement : listPhotoElements) {
                    String href = listPhotoElement.getAttribute("href");
                    photoHrefList.add(href);
                    System.out.println(href);
                }
                System.out.println("카카오사진======");
        
                // 전화번호
                System.out.println("전화번호=====");
                List<WebElement> numberElements = new ArrayList<>();
                try {
                    numberElements = driver.findElements(By.className("num_contact"));
                } catch (NoSuchElementException | TimeoutException e) {
                    System.out.println("전화번호 요소를 찾을 수 없음");
                }
                String numberList = null;
                for (WebElement element : numberElements) {
                    numberList = element.getText();
                }
                System.out.println("전화번호=======");
        
                // 영업시간
                System.out.println("영업시간=======");
                List<WebElement> timeElements = new ArrayList<>();
                try {
                    timeElements = driver.findElements(By.className("realtime_wrap"));
                } catch (NoSuchElementException | TimeoutException e) {
                    System.out.println("영업시간 요소를 찾을 수 없음");
                }
                String timeList = null;
                for (WebElement element : timeElements) {
                    System.out.println(element.getText());
                    timeList = element.getText();
                }
                System.out.println("영업시간=======");
        
                Thread.sleep(2000); // 추가 대기 시간을 넣어 안정성을 높임
        
                // 음식메뉴 이동
                System.out.println("음식메뉴======");
                driver.get(currentUrl + "#menuInfo");
                try {
                    wait.until(ExpectedConditions.presenceOfElementLocated(By.className("info_menu"))); // 요소가 로드될 때까지 대기
                    Thread.sleep(2000); // 페이지가 완전히 로드될 때까지 추가 대기
                } catch (NoSuchElementException | TimeoutException e) {
                    System.out.println("음식 메뉴 요소를 찾을 수 없음");
                }
                // 음식 메뉴 가져오기
                List<WebElement> menuElements = new ArrayList<>();
                try {
                    menuElements = driver.findElements(By.cssSelector(".list_menu .info_menu"));
                } catch (NoSuchElementException | TimeoutException e) {
                    System.out.println("음식 메뉴의 세부 요소를 찾을 수 없음");
                }
                List<Map<String, String>> menuList = new ArrayList<>();
                for (WebElement element : menuElements) {
                    Map<String, String> menuData = new HashMap<>();
                    try {
                        menuData.put("name", element.findElement(By.className("name_menu")).getText());
                        menuData.put("price", element.findElement(By.className("price_menu")).getText().trim());
                    } catch (NoSuchElementException e) {
                        System.out.println("음식 메뉴의 이름 또는 가격 요소를 찾을 수 없음");
                    }
                    menuList.add(menuData);
                }
                System.out.println("음식메뉴======");
        
                // 카카오리뷰 이동
                System.out.println("카카오리뷰======");
                driver.get(currentUrl + "#comment"); // 리뷰를 가져올 새로운 URL
                try {
                    wait.until(ExpectedConditions.presenceOfElementLocated(By.className("txt_comment"))); // 요소가 로드될 때까지 대기
                } catch (NoSuchElementException | TimeoutException e) {
                    System.out.println("리뷰 요소를 찾을 수 없음");
                }
                Thread.sleep(2000); // 페이지가 완전히 로드될 때까지 추가 대기
        
                List<WebElement> kakaoReviewElements = new ArrayList<>();
                try {
                    kakaoReviewElements = driver.findElements(By.className("inner_grade")); // 각 리뷰 요소를 찾음
                } catch (NoSuchElementException e) {
                    System.out.println("카카오 리뷰 요소를 찾을 수 없음");
                }
        
                List<Map<String, String>> kakaoReviewList = new ArrayList<>();
                for (WebElement kakaoReviewElement : kakaoReviewElements) {
                    Map<String, String> reviewData = new HashMap<>();
                    try {
                        reviewData.put("username", kakaoReviewElement.findElement(By.className("name_user")).getText());
                        reviewData.put("review", kakaoReviewElement.findElement(By.className("txt_comment")).getText());
                        reviewData.put("date", kakaoReviewElement.findElement(By.className("time_write")).getText());
                        reviewData.put("rating", kakaoReviewElement.findElement(By.cssSelector(".inner_star")).getAttribute("style"));
                        kakaoReviewList.add(reviewData);
                        System.out.println("username: " + reviewData.get("username"));
                        System.out.println("review: " + reviewData.get("review"));
                        System.out.println("date: " + reviewData.get("date"));
                        System.out.println("rating: " + reviewData.get("rating"));
                    } catch (NoSuchElementException e) {
                        System.out.println("리뷰의 세부 요소를 찾을 수 없음");
                    }
                }
                System.out.println("카카오리뷰======");
        
                // 결과를 맵에 저장
                Map<String, Object> result = new HashMap<>();
                if (!menuList.isEmpty()) {
                    result.put("menuList", menuList);
                }
                if (!kakaoReviewList.isEmpty()) {
                    result.put("kakaoReviewList", kakaoReviewList);
                }
                if (!photoHrefList.isEmpty()) {
                    result.put("photoHrefList", photoHrefList); // 사진 href 리스트를 결과에 추가
                }
                if (numberList != null) {
                    result.put("numberList", numberList);
                }
                if (timeList != null) {
                    result.put("timeList", timeList);
                }
        
                if (!blogReviewList.isEmpty()) {
                    result.put("blogReviewList", blogReviewList);
                }
        
                res.setStatus("success");
                res.setResult(result);
                driver.quit();
                return res;

    }

}
